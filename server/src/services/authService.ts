import bcrypt from 'bcryptjs';
import { db } from '../database/index.js';
import { generateToken } from '../utils/tokenManager.js';

export const authService = {
  async signup(data: any) {
    const existingUser = await db.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await db.user.create({
      data: { ...data, password: hashedPassword }
    });

    const token = generateToken(user.id);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  },

  async login(data: any) {
    const user = await db.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const token = generateToken(user.id);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  },

  async getMe(userId: string) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    return { id: user.id, email: user.email, name: user.name };
  }
};
