import { DefaultGiftCatalog } from "./catalog";

export class GiftGalaxy {

getCatalog(){

return DefaultGiftCatalog;

}

find(id:string){

return DefaultGiftCatalog.find(
gift=>gift.id===id
);

}

}
