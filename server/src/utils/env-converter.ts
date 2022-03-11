import { Env } from '../main';
/**
 * Cloud Runに展開された 環境変数を整形する
 */
export const envConverter = (value: string): Env => {
  const pairs = value.split('\n');

  let env: any = [];
  pairs.forEach((e) => {
    const [key, value] = e.split('=');

    env = [...env, { [`${key}`]: value }];
  });

  return env;
};
