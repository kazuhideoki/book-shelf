import { ApiProperty } from '@nestjs/swagger';

export class CreateImageSetDto {
  /**:
   * コメント
   * @example こめんとするよ
   */
  @ApiProperty({ description: 'コメント' })
  comment: string;
}
