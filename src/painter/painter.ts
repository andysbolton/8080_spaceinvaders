import { IMediator } from './../common/interfaces/IMediator';
import { IColleague } from './../common/interfaces/IColleague';
import Bit from '../emulator/models/Bit';
import Uint16 from '../emulator/models/Uint16';
import Uint8 from '../emulator/models/Uint8';
import utils from '../emulator/utils/utils';

export class Painter implements IColleague {
  private canvas: HTMLCanvasElement | undefined;
  private context: CanvasRenderingContext2D | null;
  public mediator: IMediator;
  private events: Events;
  private shiftRegister: Uint16 = new Uint16();
  private shiftOffset: number = 0;

  constructor(mediator: IMediator) {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.context = this.canvas.getContext && this.canvas.getContext('2d');
    this.mediator = mediator;
    this.events = new Events(this.send.bind(this));
    this.events.init();
  }

  send(port: number, val: number, bit?: Bit): void {
    this.mediator.sendIn(port, val, bit);
  }

  receive(port: number, val: number, bit?: Bit): void {
    this.write(port, val);
  }

  updateScreen(addr: number, val: number) {
    const base = addr - 0x2400;
    const y = ~(((base & 0x1f) * 8) & 0xff) & 0xff;
    const x = base >> 5;

    const bin = val.toString(2).padStart(8, '0');

    for (let i = 0; i < bin.length; i++) {
      this.paint(x, y + i, Number(bin.charAt(i)));
    }
  }

  private paint(x: number, y: number, on: number) {
    if (this.context) {
      this.context.fillStyle = on ? 'white' : 'black';
      this.context.fillRect(x * 2, y * 2, 2, 2);
    }
  }

  private write = (port: number, val: number) => {
    if (port === 6 || port === 3 || port == 5) {
      return;
    }
    switch (port) {
      case 2: // shift register result offset (bits 0,1,2)
        this.shiftOffset = val & 0x7;
        break;
      case 3: //sound related
        this.unimplementedInstruction(port, val);
        break;
      case 4: // fill shift register
        const { high } = utils.split(this.shiftRegister);

        this.shiftRegister = new Uint16((val << 8) | high.val());

        const shifted = new Uint8(
          (this.shiftRegister.val() << this.shiftOffset) >> 8
        );

        this.send(3, shifted.val());
        break;
      case 5: // sound related
        this.unimplementedInstruction(port, val);
        break;
      case 6: // debug port
        this.unimplementedInstruction(port, val);
        break;
      default:
        break;
    }
  };

  private unimplementedInstruction = (port: number, val: number) => {
    console.log(`Unimplemented code: port ${port} with value ${val}`);
  };
}

// TODO: add input
class Events {
  private onKeyPress(port: number, bit: number, val: Bit) {}

  constructor(onKeyPress: any) {
    this.onKeyPress = onKeyPress;
  }

  public init() {
    window.onkeydown = e => {
      e.preventDefault();
      const key = e.keyCode ? e.keyCode : e.which;

      switch (key) {
        case 16: {
          // shift (credit)
          this.onKeyPress(1, 0, 1);
          break;
        }
        case 37: {
          // key left (left)
          this.onKeyPress(1, 5, 1);
          break;
        }
        case 39: {
          // key right (right)
          this.onKeyPress(1, 6, 1);
          break;
        }
        case 32: {
          // space (fire)
          this.onKeyPress(1, 4, 1);
          break;
        }
        case 49: {
          // 1 (first player start)
          this.onKeyPress(1, 2, 1);
          break;
        }
        case 50: {
          // 2 (second player start)
          this.onKeyPress(1, 1, 1);
          break;
        }
        default:
          break;
      }
    };

    window.onkeyup = e => {
      e.preventDefault();
      const key = e.keyCode ? e.keyCode : e.which;

      switch (key) {
        case 16: {
          // shift (credit)
          this.onKeyPress(1, 0, 0);
          break;
        }
        case 37: {
          // key left (left)
          this.onKeyPress(1, 5, 0);
          break;
        }
        case 39: {
          // key right (right)
          this.onKeyPress(1, 6, 0);
          break;
        }
        case 32: {
          // space (fire)
          this.onKeyPress(1, 4, 0);
          break;
        }
        case 49: {
          // 1 (first player start)
          this.onKeyPress(1, 2, 0);
          break;
        }
        case 50: {
          // 2 (second player start)
          this.onKeyPress(1, 1, 0);
          break;
        }
        default:
          break;
      }
    };
  }
}
