import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonUtilService {
  generateRandomNumber(size: number) {
    const randomNumber = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(size, '0');

    return randomNumber;
  }
}
