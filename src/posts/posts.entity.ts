import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  userId: string;

  @Column("simple-array")
  commentsId: string[];

  @Column("simple-array")
  likesId: string[];

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  createDate: Date;
}

