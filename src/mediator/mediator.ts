import { IColleague } from './../common/interfaces/IColleague';
import { IMediator } from '../common/interfaces/IMediator';
import Bit from '../emulator/models/Bit';

export class Mediator implements IMediator {
  in: IColleague | undefined;
  out: IColleague | undefined;

  registerIn(colleague: IColleague): void {
    this.in = colleague;
  }

  registerOut(colleague: IColleague): void {
    this.out = colleague;
  }

  sendOut(port: number, val: number, bit: Bit): void {
    if (!this.in) {
      throw new Error('`in` is not initialized');
    }
    this.in.receive(port, val, bit);
  }

  sendIn(port: number, val: number, bit: Bit): void {
    if (!this.out) {
      throw new Error('`out` is not initialized');
    }
    this.out.receive(port, val, bit);
  }

  updateScreen(addr: number, val: number) {
    if (!this.in) {
      throw new Error('`in` is not initialized');
    }
    this.in.updateScreen(addr, val);
  }
}
