import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from "@mikro-orm/core";

@Entity()
export class Book {
  @Property()
  title!: string;

  @ManyToMany(() => User)
  author!: User;

  @ManyToOne(() => Publisher, { ref: true, nullable: true })
  publisher?: Ref<Publisher>;

  @ManyToMany({ entity: "BookTag", fixedOrder: true })
  tags = new Collection<BookTag>(this);
}
