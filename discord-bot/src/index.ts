import { Client } from 'discord.js';
import { PrismaClient } from '@prisma/client';

import danhSomeone from './danhSomeone';
import mockSomeone from './mockSomeone';
import thanks from './thanks';

const { TOKEN } = process.env;
const client = new Client();
const prisma = new PrismaClient();
let botId: string | undefined;

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  botId = client.user?.id;
});

client.on('message', (msg) => {
  danhSomeone(msg);
  mockSomeone(msg);
  thanks(msg, botId as any, prisma);
});

client.login(TOKEN);
process.on('SIGTERM', () => process.exit());
