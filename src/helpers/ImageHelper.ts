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
    const { folder, name, id } = item;
    const filename = name.toLowerCase().replace(/\s/g, "-").replace(/'/, "");
    const game = item.id > 151 ? 'forgotten-circles' : 'gloomhaven'
    const hasAlternateForm = id >= 71 && id <= 95
    const prefix = `${(item.id > 151 ? 'fc' : 'gh')}-${item.id.toString().padStart(3, '0')}${hasAlternateForm ? 'b' : ''}`
    return require(`../../vendor/any2cards/images/items/${game}/${folder}/${prefix}-${filename}.png`)
}
