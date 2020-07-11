import { GloomhavenItemSlot, GloomhavenItem } from "../State/Types";

export const getSlotImageSrc = (slot: GloomhavenItemSlot):string => {
    let src: string;
    switch (slot) {
        case "Head":
            src = 'head';
            break;
        case "Body":
            src = 'body';
            break;
        case "Legs":
            src = 'legs';
            break;
        case "One Hand":
            src = '1h';
            break;
        case "Two Hands":
            src = '2h';
            break;
        case "Small Item":
            src = 'small';
            break;
        default:
            throw new Error(`item slot unrecognized: ${slot}`);
    }
    return require('../img/icons/equipment_slot/'+src+'.png');
}

export const getItemImageSrc = (item: GloomhavenItem): string => {
    let src = '';
    let name = item.name.toLowerCase().replace(/\s/g, '-').replace(/'/, '');
    if (item.id >= 64) {
        src = require('../../vendor/any2cards/images/items/64-151/' + name + '.png');
    } else if (item.id <= 14) {
        src = require('../../vendor/any2cards/images/items/1-14/' + name + '.png');
    } else {
        let range_from = item.id % 7 === 0
            ? Math.floor((item.id - 1) / 7) * 7
            : Math.floor((item.id) / 7) * 7;
        src = require('../../vendor/any2cards/images/items/' + (range_from + 1) + '-' + (range_from + 7) + '/' + name + '.png');
    }
    return src;
}