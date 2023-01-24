// @ts-nocheck
import type { NextAuthOptions } from "next-auth"
import { User } from '../../models/users/model'
import { Schema, model } from 'mongoose';
import { Session } from '../../models/session/model';
import { Populate } from '../../utils/zod';
import { UserAuthData } from '../../data';
import LRU, { Options } from 'lru-cache';


export const debugNextAuth = true;
const DEBUG = true; //debugNextAuth;

const cacheOptions: Options<string, any> = {
    max: 1000,
    ttl: 1000 * 60 * 5,
}

const cache = {
    users: new LRU({
        ...cacheOptions,
    }),
    sessions: new LRU({
        ...cacheOptions,
    }),
} as const;


export function NextAuthAdapter(client, options): NextAuthOptions['adapter'] {
    return {
        async createUser(user) {
            const doc = new User({
                email: user.email,
            })
            await doc.save();
            if (DEBUG) console.log(':: auth.createUser', { user }, doc.toObject());
            return doc.toObject({ virtuals: true });
        },
        async getUser(id) {
            const key = `id:${id}`;
            if (cache.users.get(key)) {
                if (DEBUG) console.log('using cached value for', { key });
                return cache.users.get(key);
            }
            const user = await User.findById(id).lean();
            if (DEBUG) console.log(':: auth.getUser', { id }, user);
            // todo: fix missing fields
            if (user) {
                cache.users.set(key, user);
            }
            return user;
        },
        async getUserByEmail(email) {
            const key = `email:${email}`;
            if (cache.users.get(key)) {
                if (DEBUG) console.log('using cached value for', { key });
                return cache.users.get(key);
            }
            const user = await User.findOne({
                $or: [
                    { email: { $eq: email } },
                    ...Object.keys(options.providers).map(k => ({
                        auth: {
                            [k]: {
                                email: {
                                    $eq: email,
                                }
                            }
                        }
                    }))
                ]
            })
            if (DEBUG) console.log(':: auth.getUserByEmail', { email }, user);
            if (user) {
                cache.users.set(key, user);
            }
            return user;
        },
        async getUserByAccount({ providerAccountId, provider }) {
            const key = `${provider}:${providerAccountId}`;
            if (cache.users.get(key)) {
                if (DEBUG) console.log('using cached value for', { key });
                return cache.users.get(key);
            }
            const user = await User.findOne({
                [`auth.${provider}.id`]: providerAccountId,
                // auth: {
                //     [provider]: {
                //         id: {
                //             $eq: providerAccountId,
                //         }
                //     }
                // }
            }).lean();
            if (DEBUG) console.log(':: auth.getUserByAccount', { provider, providerAccountId }, user);
            if (user) {
                user.id = user._id.toString();
                cache.users.set(key, user);
            }
            return user;
        },
        async updateUser(user) {
            if (DEBUG) console.log('auth.updateUser', { user });
            return
        },
        async deleteUser(userId) {
            if (DEBUG) console.log('auth.deleteUser', { userId });
            return
        },
        async linkAccount(account) {
            const user = await User.findById(account.userId)
            if (user) {
                user.set(`auth.${account.provider}.id`, account.providerAccountId);
                await user.save();
            }
            if (DEBUG) console.log(':: auth.linkAccount', { account }, user?.toObject());
            return
        },
        async unlinkAccount({ providerAccountId, provider }) {
            if (DEBUG) console.log('auth.unlinkAccount', { providerAccountId, provider });
            return
        },
        async createSession({ sessionToken, userId, expires }) {
            const session = new Session({
                sessionToken,
                user: userId,
                expires,
            });
            await session.save();
            if (DEBUG) console.log(':: auth.createSession', { sessionToken, userId, expires }, session);
            return session.toObject();
        },
        async getSessionAndUser(sessionToken) {
            const key = `session:${sessionToken}`;
            if (cache.sessions.get(key)) {
                if (DEBUG) console.log('using cached value for', { key });
                return cache.sessions.get(key);
            }
            const session = await Session.findOne({
                sessionToken: sessionToken
            }).populate(['user']).lean<Populate<Session.Data, 'user'>>();
            if (DEBUG) console.log(':: auth.getSessionAndUser', { sessionToken }, session);
            const result = session ? {
                user: session.user,
                session,
            } : null;
            if (result) cache.sessions.set(key, result);
            return result;
        },
        async updateSession({ sessionToken, userId: user, ..._rest }) {
            const rest = { user, ..._rest };
            await Session.updateOne({
                sessionToken: sessionToken
            }, rest);
            const session = await Session.findOne({
                sessionToken: sessionToken
            }).populate(['user']).lean<Populate<Session.Data, 'user'>>();
            if (DEBUG) console.log(':: auth.updateSession', { sessionToken });
            return session;
        },
        async deleteSession(sessionToken) {
            const key = `session:${sessionToken}`;
            cache.sessions.delete(sessionToken);
            await Session.deleteOne({
                sessionToken: sessionToken
            });
            if (DEBUG) console.log('auth.deleteSession', { sessionToken });
            return
        },
        async createVerificationToken({ identifier, expires, token }) {
            if (DEBUG) console.log('auth.createVerificationToken', { identifier, expires, token });
            return
        },
        async useVerificationToken({ identifier, token }) {
            if (DEBUG) console.log('auth.useVerificationToken', { identifier, token });
            return
        },
    }
}