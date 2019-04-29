import {conf} from '../config';
import cli from 'cli-ux';
import {Command, flags} from '@oclif/command'
import {setToken} from "../set-token";

export default class Init extends Command {
  static description = 'Initialize config';

  static examples = [
    `$ dumpcord init`,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
  };

  static args = [
    {
      name: 'token',               // name of arg to show in help and reference with args[name]
      required: true,            // make the arg required with `required: true`
      description: 'Discord token', // help description
      parse: (input: string) => input.toString().trim()
    }
  ];

  async run() {
    const {args} = this.parse(Init);
    let token = args.token;
    setToken(token);
    console.log('Done! Run `dumpcord dump` to start dumping');
  }
}
