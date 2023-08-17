const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const DiscordOauth2 = require('discord-oauth2');
const config = require('../config');
const bodyParser = require('body-parser');
const Guild = require('../models/Guild');
const discord = require('discord.js');

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {

  const app = express();
  const oauth = new DiscordOauth2();

  app.set('view engine', 'ejs');

  app.use(session({
    secret: config.app.sessionSecret,
    resave: false,
    saveUninitialized: false
  }));

  app.use(bodyParser.urlencoded({ extended: true }));

  // Home
  app.get('/', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    const serverCount = client.guilds.cache.size;
    const userCount = client.users.cache.size;

    res.render(`${__dirname}/views/index.ejs`, { isLoggedIn, serverCount, userCount });
  });

  //Support
  app.get("/support", (req, res) => {
    res.redirect(config.inviteSupport);
  });

  //Github
  app.get("/github", (req, res) => {
    res.redirect("https://github.com/cheraphdev");
  });

  //Add bot
  app.get("/add", (req, res) => {
    res.redirect("https://discord.com/api/oauth2/authorize?client_id=1114937352465420288&permissions=338977&scope=bot%20applications.commands");
  });

  // URL auth Discord
  app.get('/login', (req, res) => {
    const authUrl = oauth.generateAuthUrl({
      clientId: config.app.clientId,
      scope: ['identify', 'guilds'],
      redirectUri: config.app.redirectUri
    });

    req.session.isLoggedIn = true;

    res.redirect(authUrl);
  });

  // Save token Discord
  app.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
      res.redirect('/');
      return;
    }

    try {
      const tokenData = await oauth.tokenRequest({
        grantType: 'authorization_code',
        clientId: config.app.clientId,
        clientSecret: config.app.clientSecret,
        code,
        scope: ['identify', 'guilds'],
        redirectUri: config.app.redirectUri
      });

      req.session.accessToken = tokenData.access_token;

      if (!req.session.accessToken) {
        res.redirect('/');
        return;
      }

      const user = await oauth.getUser(req.session.accessToken);
      req.session.user = user;

      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error retrieving access token:', error);
      res.redirect('/');
    }
  });

  app.get('/dashboard', async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;

    if (!req.session.accessToken) {
      res.redirect('/');
      return;
    }

    try {
      const user = await oauth.getUser(req.session.accessToken);
      const guilds = await oauth.getUserGuilds(req.session.accessToken);

      const manageableGuilds = await Promise.all(guilds.map(async guild => {
        const guildObj = client.guilds.cache.get(guild.id);
        if (guildObj) {
          await guildObj.members.fetch();
          const member = guildObj.members.cache.get(user.id);
          if (member && member.permissions.has('MANAGE_GUILD')) {
            return guild;
          }
        }
        return null;
      }));

      const filteredGuilds = manageableGuilds.filter(guild => guild !== null);

      res.render(`${__dirname}/views/dashboard/index.ejs`, {
        user,
        guilds: filteredGuilds,
        isLoggedIn
      });
    } catch (error) {
      console.error('Error while retrieving data:', error);
      res.redirect('/');
    }
  });

  // Dashboard server config panel
  /*app.get('/dashboard/server/:id', async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    const serverId = req.params.id;
  
    try {
      const guild = await Guild.findOne({ id: serverId });
  
      if (guild) {
        const welcomeMessage = guild.joinMessage;
        const welcomeChannelId = guild.joinChannel;
        
        const leaveMessage = guild.leaveMessage;
        const leaveChannelId = guild.leaveChannel;
  
        res.render(`${__dirname}/views/dashboard/server.ejs`, {
          serverId,
          welcomeMessage,
          welcomeChannelId,
          leaveMessage,
          leaveChannelId,
          isLoggedIn
        });
      } else {
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error('Error retrieving guild:', error);
      res.redirect('/dashboard');
    }
  });*/

  // Dashboard server config panel
  app.get('/dashboard/server/:id', async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    const serverId = req.params.id;

    try {
      const guild = await Guild.findOne({ id: serverId });

      if (guild) {
        const guildObj = client.guilds.cache.get(serverId);
        if (guildObj) {
          const member = guildObj.members.cache.get(req.session.user?.id);
          if (member && member.permissions.has('MANAGE_GUILD')) {
            const welcomeMessage = guild.joinMessage;
            const welcomeChannelId = guild.joinChannel;

            const leaveMessage = guild.leaveMessage;
            const leaveChannelId = guild.leaveChannel;

            res.render(`${__dirname}/views/dashboard/server.ejs`, {
              serverId,
              welcomeMessage,
              welcomeChannelId,
              leaveMessage,
              leaveChannelId,
              isLoggedIn
            });
          } else {
            res.redirect('/dashboard');
          }
        } else {
          res.redirect('/dashboard');
        }
      } else {
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error('Error retrieving guild:', error);
      res.redirect('/dashboard');
    }
  });

  // Dashboard server config join
  app.get('/dashboard/server/:id/welcome', async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    const serverId = req.params.id;

    try {
      const guild = await Guild.findOne({ id: serverId });

      if (guild) {
        const guildObj = client.guilds.cache.get(serverId);
        if (guildObj) {
          const member = guildObj.members.cache.get(req.session.user?.id);
          if (member && member.permissions.has('MANAGE_GUILD')) {
            const channels = guildObj.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');
            const availableChannels = channels.map(channel => ({
              id: channel.id,
              name: channel.name
            }));

            res.render(`${__dirname}/views/dashboard/configjoin.ejs`, { serverId, channels: availableChannels, isLoggedIn });
          } else {
            res.redirect('/dashboard');
          }
        } else {
          res.redirect('/dashboard');
        }
      } else {
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error('Error retrieving guild:', error);
      res.redirect('/dashboard');
    }
  });

  // Dashboard server config join post
  app.post('/dashboard/server/:id/welcome/save', async (req, res) => {
    const serverId = req.params.id;
    const { welcomeChannel, welcomeMessage } = req.body;

    try {
      const guild = await Guild.findOne({ id: serverId });

      if (guild) {
        guild.joinChannel = welcomeChannel;
        guild.joinMessage = welcomeMessage;
        await guild.save();

        res.redirect('/dashboard');
      } else {
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error('Error updating server configuration:', error);
      res.redirect('/dashboard');
    }
  });

  // Dashboard server config leave
  app.get('/dashboard/server/:id/leave', async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    const serverId = req.params.id;

    try {
      const guild = await Guild.findOne({ id: serverId });

      if (guild) {
        const guildObj = client.guilds.cache.get(serverId);
        if (guildObj) {
          const member = guildObj.members.cache.get(req.session.user.id);
          if (member && member.permissions.has('MANAGE_GUILD')) {
            const channels = guildObj.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');
            const availableChannels = channels.map(channel => ({
              id: channel.id,
              name: channel.name
            }));

            res.render(`${__dirname}/views/dashboard/configleave.ejs`, { serverId, channels: availableChannels, isLoggedIn });
          } else {
            res.redirect('/dashboard');
          }
        } else {
          res.redirect('/dashboard');
        }
      } else {
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error('Error retrieving guild:', error);
      res.redirect('/dashboard');
    }
  });

  // Dashboard server config leave post
  app.post('/dashboard/server/:id/leave/save', async (req, res) => {
    const serverId = req.params.id;
    const { leaveChannel, leaveMessage } = req.body;

    try {
      const guild = await Guild.findOne({ id: serverId });

      if (guild) {
        guild.leaveChannel = leaveChannel;
        guild.leaveMessage = leaveMessage;
        await guild.save();

        res.redirect('/dashboard');
      } else {
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error('Error updating server configuration:', error);
      res.redirect('/dashboard');
    }
  });

  app.listen(config.app.port, () => {
    console.log(`[App] App running on port ${config.app.port}`);
  });
}