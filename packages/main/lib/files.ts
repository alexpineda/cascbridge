import path from "path";
import fs, { promises as fsPromises } from "fs";

export async function fileExists( path: string ) {
    try {
        await fsPromises.access( path, fs.constants.R_OK );
        return true;
    } catch ( err ) {
        return false;
    }
}

export const foldersExist = async ( rootDirectory: string, directories: string[] ) => {
    if ( await fileExists( rootDirectory ) ) {
        for ( const folder of directories ) {
            if ( !( await fileExists( path.join( rootDirectory, folder ) ) ) ) {
                return false;
            }
        }
    } else {
        return false;
    }
    return true;
};

export const looksLikeStarCraftDir = async (scFolder: string)  => await foldersExist( scFolder, [
    "Data",
    "locales",
  ] );
  