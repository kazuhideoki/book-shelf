import { DisplaySet } from '../../display-sets/entities/display-set.entity';

export type RegisterDispalySet = Pick<DisplaySet, 'name'> & {
  files: DisplaySet['files'];
};
