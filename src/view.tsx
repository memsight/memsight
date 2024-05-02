import { storeViewByName } from "./renderer";
import ApiSetting from "./view/ApiSetting";
import Hello from "./view/Hello";
import Note from "./view/Note";

export default function initView() {
    storeViewByName('hello', Hello)
    storeViewByName('apiSetting', ApiSetting)
    storeViewByName('note', Note)
}