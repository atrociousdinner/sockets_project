import { IsNumber, IsOptional } from 'class-validator';

export class PlaceBidDto {
  @IsNumber()
  auction_id: number;

  @IsNumber()
  @IsOptional()
  user_id: number;

  @IsNumber()
  bidAmount: number;

  @IsNumber()
  @IsOptional()
  parentBidId: number;
}
