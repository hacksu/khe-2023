// @ts-nocheck
import type { NextAuthOptions } from "next-auth"
import { User } from '../../models/users/model'
import { Schema, model } from 'mongoose';
import { Session } from '../../models/session/model';
import { Populate } from '../../utils/zod';
import { UserAuthData } from '../../data';


export const debugNextAuth = true;
const DEBUG = debugNextAuth;


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
            const user = await User.findById(id).lean();
            if (DEBUG) console.log(':: auth.getUser', { id }, user);
            // todo: fix missing fields
            return user;
        },
        async getUserByEmail(email) {
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
            return user;
        },
        async getUserByAccount({ providerAccountId, provider }) {
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
            const session = await Session.findOne({
                sessionToken: sessionToken
            }).populate(['user']).lean<Populate<Session.Data, 'user'>>();
            if (DEBUG) console.log(':: auth.getSessionAndUser', { sessionToken }, session);
            return session ? {
                user: session.user,
                session,
            } : null;
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