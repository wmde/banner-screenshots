export enum Dimension {
    BANNER = 'banner',
    DEVICE = 'device',
    PLATFORM = 'platform',
    ORIENTATION = 'orientation',
    RESOLUTION = 'resolution',
}

export function isValidDimension( value: any ): value is Dimension {
    return Object.values(Dimension).includes( value as Dimension );
}
