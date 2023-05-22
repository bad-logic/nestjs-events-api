import * as bcrypt from 'bcrypt';

export class Password {
  private password: string;

  constructor(password: string) {
    this.password = password;
  }

  public async hash(): Promise<string> {
    return bcrypt.hash(this.password, 10);
  }

  public async compare(hash: string): Promise<boolean> {
    return bcrypt.compare(this.password, hash);
  }
}
