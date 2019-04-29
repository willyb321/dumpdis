import { conf } from './../config';
import cli from 'cli-ux';
import {Command, flags} from '@oclif/command'
import * as Discord from 'discord.js';
import {resolve} from 'path';
import {appendFileSync} from 'fs';

export default class Init extends Command {
  static description = 'Initialize config'

  static examples = [
    `$ dumpcord dump`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    id: flags.string({char: 'i', description: 'Discord channel / server ID?'}),
    output: flags.string({char: 'o', description: 'Output path? (relative to current directory)'})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(Init);
    if (!conf.get('token')) {
      console.log('Run `dumpcord init` first!');
      process.exit(0);
    }
    let channelId = flags.id;
    if (!channelId) {
      channelId = await cli.prompt('What discord channel or server ID to dump?');
    }
    let outPath: any = flags.output;
    if (!outPath) {
      outPath = await cli.prompt('Output directory? (relative to current directory)');
    }
    outPath = resolve(outPath);
    console.log(outPath);
    const client = new Discord.Client();

    client.on('ready', () => {
      console.log('About to start dumping!');
      this.dump(outPath, channelId, client);
    });

    client.login(conf.get('token'));
  }

  async dump(outPath: string, id: any, client: Discord.Client) {
    const server: any = !!client.guilds.get(id) ? client.guilds.get(id) : client.channels.get(id);
    if (!server) {
      console.log('Not a server or channel, exiting');
      process.exit(0);
    }
    console.log(`Dumping ${server.name}`);
    const channel = server as Discord.TextChannel;
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
    if (!messages[messages.length-1]) {
      let newMsgs: any = await channel.fetchMessages({before: channel.lastMessageID || channel.lastMessageID, limit: 100});
      newMsgs = newMsgs.array();
      messages = messages.concat(newMsgs);
    } else {
      let newMsgs: any = await channel.fetchMessages({before: messages[messages.length-1].id || channel.lastMessageID, limit: 100});
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
