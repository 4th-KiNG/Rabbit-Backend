import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  userId: string;

  @Column("simple-array", { nullable: true })
  commentsId: string[];

  @Column("simple-array", { nullable: true })
  likeId: string[];

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  createDate: Date;
}
