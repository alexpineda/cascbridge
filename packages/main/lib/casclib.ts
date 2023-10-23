import * as casclibDisk from "./casclib-disk";
import * as casclib from "bw-casclib";

let _storageHandle: any, _storagePath: string, _storageIsDisk: boolean;

export const setStoragePath = ( path: string ) => {
    _storagePath = path;
};

export const setStorageIsDisk = ( isCasc: boolean ) => {
    _storageIsDisk = isCasc;
};

export const readCascFile = async ( filePath: string, openIfClosed = false ): Promise<Buffer> => {
    if ( _storageIsDisk ) {
        return casclibDisk.readFile( filePath, _storagePath );
    }
    if (openIfClosed && !_storageHandle) {
        await casclib.openStorage( _storagePath );
    }
    return await casclib.readFile( _storageHandle, filePath );
};

export const findFile = async ( fileName: string ) => {
    if ( _storageIsDisk ) {
        return casclibDisk.findFile( fileName, _storagePath );
    }
    const files = await casclib.findFiles( _storageHandle, `*${fileName}` );
    if ( files.length === 0 ) {
        return undefined;
    }
    return files[0].fullName;
};

export const findFiles = async ( fileName: string ) => {
    if ( _storageIsDisk ) {
        throw new Error( "Not implemented" );
    }
    return ( await casclib.findFiles( _storageHandle, `*${fileName}` ) ).map(
        ( { fullName } ) => fullName
    );
};

export const openCascStorage = async () => {
    if ( _storageIsDisk ) {
        return;
    }
    if ( _storageHandle ) {
        casclib.closeStorage( _storageHandle );
    }
    try {
        _storageHandle = ( await casclib.openStorage( _storagePath ) ) as unknown;
        if ( _storageHandle === undefined ) {
            throw new Error( `Failed to open CASC storage at ${_storagePath}` );
        }
    } catch ( e ) {
        throw new Error( `Failed to open CASC storage at ${_storagePath}` );
    }
};

export const closeCascStorage = () => {
    if ( _storageIsDisk ) {
        return;
    }
    _storageHandle && casclib.closeStorage( _storageHandle );
};

export default readCascFile;
