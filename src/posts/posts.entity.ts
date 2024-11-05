import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
  //id у нас будет иметь тип string
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  title: string;

  @Column()
  userId: string;

  //переназови переменную commentsId, чтобы более понятно было. Свойство nullable должно быть true у полей,
  //которые могут равняться значению null.
  //Так же все id будут иметь тип string, а самих id будет много, поэтому поле должно быть string[] (массив)
  //Если свойство будет в виде массива, то нужно вначале указать, что это simple-array. Я как пример написал в этом свойстве,
  //тебе нужно проставить такое же в других поля, где массивы используются
  @Column("simple-array", { nullable: false })
  comId: number;

  //все аналогично поправить как в comId
  @Column({ nullable: false })
  likeId: number;

  //это свойство тоже может иметь значение null
  @Column()
  text: string;

  //это свойство тоже может иметь значение null
  @Column()
  image: string;

  @Column()
  createDate: Date;
}
