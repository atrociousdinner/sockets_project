import { UsePipes, ValidationPipe } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Auction } from './auction.entity';
@WebSocketGateway(3001, {
  cors: {
    origin: ['http://localhost:3000'],
  },
})
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class AuctionGateway {
  constructor() {}

  @WebSocketServer()
  server: Server;

  handleAuctionClose(auction: Auction) {
    this.server.to(String(auction.room.room_id)).emit('auctionClosed', {
      auction,
    });
  }
}
