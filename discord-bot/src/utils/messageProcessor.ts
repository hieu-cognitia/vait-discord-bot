import { Message } from 'discord.js';

export interface PrefixedCommand {
  matcher: string;
  fn: (message: Message) => Promise<any>;
}

export interface PrefixedCommands {
  prefix: string;
  commands: Array<PrefixedCommand>;
}

export interface KeywordMatchCommand {
  matchers: Array<string>;
  fn: (message: Message) => Promise<any>;
}
export interface EmojiMatchCommand {
  matcher: string;
  fn: (message: Message) => Promise<any>;
}
export interface CommandConfig {
  prefixedCommands: PrefixedCommands;
  keywordMatchCommands: Array<KeywordMatchCommand>;
  emojiMatchCommand: EmojiMatchCommand;
}

export const processMessage = async (
  message: Message,
  config: CommandConfig
) => {
  const keywordPromises = processKeywordMatch(
    message,
    config.keywordMatchCommands
  );
  const prefixPromises = processPrefixedMatch(message, config.prefixedCommands);
  const emojiPromises = processEmojiMatch(message, config.emojiMatchCommand);
  const promises = [
    ...keywordPromises,
    ...prefixPromises,
    emojiPromises,
  ].filter((p) => p !== undefined);

  await Promise.all(promises).catch(console.error);
};

const processEmojiMatch = (
  message: Message,
  config: EmojiMatchCommand
): Promise<any> | undefined => {
  const hasEmoji = message.content.match(config.matcher);
  if (!hasEmoji) {
    return;
  }
  return config.fn(message);
};

const processKeywordMatch = (
  message: Message,
  config: Array<KeywordMatchCommand>
): Array<Promise<any> | undefined> => {
  return config.map((conf) => {
    const hasKeyword = conf.matchers.some((keyword) =>
      message.content.toLowerCase().includes(keyword)
    );

    if (!hasKeyword) {
      return;
    }

    return conf.fn(message);
  });
};

const processPrefixedMatch = (
  message: Message,
  config: PrefixedCommands
): Array<Promise<any> | undefined> => {
  return config.commands.map((conf) => {
    const hasMockPrefix = message.content
      .toLowerCase()
      .startsWith(`${config.prefix}${conf.matcher}`);

    if (!hasMockPrefix) {
      return;
    }

    return conf.fn(message);
  });
};
