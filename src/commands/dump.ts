import {conf} from '../config';
import cli from 'cli-ux';
import {Command, flags} from '@oclif/command'
import * as Discord from 'discord.js';
import {resolve} from 'path';
import {appendFileSync} from 'fs';

export default class Dump extends Command {
  static description = 'Initialize config'

  static examples = [
    `$ dumpcord dump`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    id: flags.string({char: 'i', required: true, description: 'Discord channel / server ID?'}),
  }

  static args = [
    {
      name: 'output',               // name of arg to show in help and reference with args[name]
      required: false,            // make the arg required with `required: true`
      description: 'Output path? (relative to current directory)', // help description
      parse: (input: string) => input.toString().trim(),
      default: `dumpdis_${new Date().toISOString()}.txt`,
      char: 'o'
    }
  ]

  async run() {
    const {args, flags} = this.parse(Dump);
    if (!conf.get('token')) {
      console.log('Run `dumpcord init` first!');
      process.exit(0);
    }
    let channelId = flags.id;
    if (!channelId) {
      channelId = await cli.prompt('What discord channel or server ID to dump?');
    }
    let outPath: any = args.output;
    if (!outPath) {
      outPath = await cli.prompt('Output directory? (relative to current directory)');
    }
    outPath = resolve(outPath);
    console.log(outPath);
    const client = new Discord.Client();

    client.on('ready', () => {
      console.log('About to start dumping!');
      cli.action.start('Dumping');
      let toDump;
      if (client.guilds.has(channelId || '')) {
        const guild = client.guilds.get(channelId || '');
        if (!guild) {
          return;
        }
        const channel = guild.channels.array()[0].id;
        toDump = client.channels.get(channel) as Discord.TextChannel;
      } else if (client.channels.has(channelId || '')) {
        toDump = client.channels.get(channelId || '') as Discord.TextChannel;
      }
      if (!toDump) {
        cli.action.stop(`Couldn't find a server or channel with ID ${channelId}`);
        return
      }
      console.log(`Dumping channel / server: ${toDump.name}`);
      this.dump(outPath, toDump, client);
    });

    client.login(conf.get('token'));
  }

  async dump(outPath: string, channel: Discord.TextChannel, client: Discord.Client) {
    if (!channel) {
      console.log('Not a server or channel, exiting');
      process.exit(0);
    }
    let messages = await this.fetchMessages(client, channel, []);
    messages = messages.reverse();
    console.log(`Done dumping messages (total: ${messages.length})`);
    messages.forEach(msg => {
      let attachments = ``;
      msg.attachments.array().forEach((e: any) => attachments += e.url + '\t')
      const toDump = `${msg.author.tag} (date: ${msg.createdAt.toISOString()}, author id: ${msg.author.id}, msg id: ${msg.id}): ${msg.cleanContent}\t${attachments}\n`;
      appendFileSync(outPath, toDump);
    });
  }

  async fetchMessages(client: any, channel: Discord.TextChannel, messages: any[]): Promise<any[]> {
    let oldMsgCount = messages.length;
    if (!messages[messages.length - 1]) {
      let newMsgs: any = await channel.messages.fetch({before: channel.lastMessageID || '', limit: 100});
      newMsgs = newMsgs.array();
      messages = messages.concat(newMsgs);
    } else {
      let newMsgs: any = await channel.messages.fetch({before: channel.lastMessageID || '', limit: 100});
      newMsgs = newMsgs.array();
      messages = messages.concat(newMsgs);
    }
    console.log(`Dumping messages (total so far: ${messages.length})`);
    if (oldMsgCount < messages.length) {
      return this.fetchMessages(client, channel, messages);
    }
    return messages;
  }
}
