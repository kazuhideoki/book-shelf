import AsyncHooks, {
  executionAsyncId,
  executionAsyncResource,
} from 'async_hooks';
import { v4 } from 'uuid';
import { Constructor } from '../../../type/type-helper';

/**
 * どういった文脈でプログラムが実行されているか (dataset) を保持する構造体
 * Context のインスタンスは ContextHolder が保持する
 *
 * (例)
 * - 特定のユーザーとして認証され、特定のTenantに属しているデータの操作のみを認可されている
 * - 特定の HTTP リクエストから実行された操作である
 */
export abstract class Context {
  static get instance(): Context {
    throw new Error(`Need override`);
  }

  static get hasInstance(): boolean {
    try {
      this.instance;
      return true;
    } catch (ignored) {
      return false;
    }
  }
}

type Structure = { [name: string]: any };

/**
 * AsyncHooks の AsyncResource を用いて Context 等を保持する
 * Context だけではく他のデータも保持できる
 */
export class ContextHolder {
  static PROP_NAME = 'APP_STRUCTURE';
  private static hook: AsyncHooks.AsyncHook;

  /**
   * AsyncHook を初期化
   */
  private static enable() {
    if (this.hook == null) {
      this.hook = AsyncHooks.createHook({
        init: (asyncId, type, triggerAsyncId, childCR: any) => {
          const parentCR: any = AsyncHooks.executionAsyncResource() || {};
          childCR[ContextHolder.PROP_NAME] = parentCR[ContextHolder.PROP_NAME];
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        destroy: (asyncId) => {},
      }).enable();
    }
  }

  private static disable() {
    if (this.hook) {
      this.hook.disable();
      this.hook = null as any;
    }
  }

  static get structure(): Structure {
    const structure: Structure = (executionAsyncResource() as any)[
      ContextHolder.PROP_NAME
    ];
    if (structure == null) {
      throw new Error(`Session not started`);
    }
    return structure;
  }

  static initContext() {
    ContextHolder.enable();
    const cr: any = executionAsyncResource();

    const parentStructure = cr[ContextHolder.PROP_NAME];

    const base: BaseContext = new BaseContext(
      executionAsyncId(),
      v4(),
      parentStructure?.BaseContext,
    );

    const structure = (cr[ContextHolder.PROP_NAME] = {
      BaseContext: base,
      parentStructure,
    });
    console.debug(`[Context] Start Session ${base.execId}-${base.seq}`);
    return structure;
  }

  /**
   * AsyncResource へ任意の context を保持する
   *
   * @param contextInstance 保持したいデータ (何らかのクラスインスタンスであることが必須)
   * @param name data が何らかのクラスインスタンスの場合不要 (エラーが出る)、それ以外の場合必須
   */
  static set<T>(contextInstance: T): T {
    const name = (contextInstance as any)?.constructor?.name;
    if (name == null) {
      throw new Error(`Can not set non-instance data`);
    }

    if (this.structure[name] != null) {
      throw new Error(`Context ${name} already set`);
    }

    this.structure[name] = contextInstance;
    return contextInstance;
  }

  static has<T>(clazz: Constructor<T>): boolean {
    return this.getOrNull(clazz) != null;
  }

  /**
   * @param clazz のコンテキストが存在していれば throw
   */
  static assertEmpty<T>(clazz: Constructor<T>) {
    if (this.getOrNull(clazz) != null) {
      throw new Error(`Context ${clazz.name} should be empty, but set`);
    }
  }

  /**
   * @param clazz 要求するコンテキストのクラス
   * @returns 要求したコンテキストのインスタンス or (set されていない場合 null)
   */
  static getOrNull<T>(clazz: Constructor<T>): T | null {
    try {
      const name = clazz.name;
      const contextInstance = this.structure[name];
      return contextInstance || null;
    } catch (ignored) {
      return null;
    }
  }

  /**
   * @param clazz 要求するコンテキストのクラス
   * @returns 要求したコンテキストのインスタンス (set されていない場合 throw)
   */
  static get<T>(clazz: Constructor<T>): T {
    const contextInstance = this.getOrNull(clazz);
    if (contextInstance == null) {
      throw new Error(`Requires set ${clazz.name} before call here`);
    }
    return contextInstance;
  }
}

export class BaseContext {
  readonly root?: BaseContext;
  private _rootNextSeq = -1;
  readonly seq: number;

  constructor(
    readonly asyncId: number,
    readonly execId: string,
    source?: BaseContext,
  ) {
    this.root = source?.root || source;

    if (this.root == null) {
      this.seq = 1;
      this._rootNextSeq = 2;
    } else {
      this.seq = this.root._rootNextSeq++;
      this.execId = this.root.execId;
    }
  }

  static get instance() {
    return ContextHolder.get(BaseContext);
  }
}
