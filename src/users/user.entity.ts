import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // Whenever we transform an instance of User into plain object
  // and then JSON, this property will be excluded
    // @Exclude() (we will create our own interceptor, unlike NestJS recommends)
  password: string;

  // Hooks

  @AfterInsert()
  logInsert() {
    console.log(`Inserted user with the id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user with the id: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed user with the id: ${this.id}`);
  }
}