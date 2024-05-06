import { storeViewByName } from "./renderer";
import ApiSetting from "./view/ApiSetting";
import Hello from "./view/Hello";
import Note from "./view/Note";
import WhiteList from "./view/WhiteList";
import WhiteListItem from "./view/WhiteListItem";

export default function initView() {
    storeViewByName('hello', Hello)
    storeViewByName('apiSetting', ApiSetting)
    storeViewByName('note', Note)
    storeViewByName('whiteList', WhiteList)
    storeViewByName('showWhiteList', WhiteListItem)
}