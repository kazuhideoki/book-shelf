/**
 * TypeORM エンティティはすべてこれを継承する
 * エンティティはすべて immutable な作りである想定
 */
export abstract class BaseEntity<SELF extends BaseEntity = any> {
  /**
   * - 新規エンティティデータを生成する場合
   * - (TypeORM 経由で DB から Read された場合)
   * 2通りのみ呼ばれる
   *
   * @param data
   */
  public constructor(data: Partial<SELF>) {
    Object.assign(this, data);
  }
}
