import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import Papa, { type ParseResult } from 'papaparse';
import { z } from "zod";
import { useGetLevelsLookup } from "../../levels/hooks/levelHooks";
import { useGetGenres } from "../../genres/hooks/genreHooks";
import { useGetSourcesLookup } from "../../sources/hooks/sourceHooks";
import type { SourceLookup } from "../../sources/types/source.type";
import type { LevelLookup } from "../../levels/types/level.type";
import type { Genre } from "../../genres/types/genre.type";

// import { useImportSheets } from "../services/sheetService";

// TYPE
type SheetImportProps = {
    sourcesLookup: SourceLookup[],
    isLoadingSource: boolean,
    levelsLookup: LevelLookup[],
    isLoadingLevel: boolean,
    genresLookup: Genre[],
    isLoadingGenre: boolean
}


// SCHEMA
const csvSheetSchema = z.object({
    title: z.string().trim().min(1, 'Sheet title is required'),
    key: z.string().trim().nullable().optional(),
    composer: z.string().trim().nullable().optional(),
    source: z.string().trim().nullable().optional(),
    level: z.string().trim().nullable().optional(),
    genre: z.string().trim().nullable().optional(),
    examPiece: z.string().trim().nullable().optional(),
});

const dbSheetSchema = z.looseObject({
    sourceId: z.number()
        .int('Source Id must be an integer')
        .positive('Source Id must be positive')
        .nullable()
        .optional(),
    levelId: z.number()
        .int('Level Id must be an integer')
        .positive('Level Id must be positive')
        .nullable()
        .optional(),
    genreId: z.number()
        .int('Genre Id must be an integer')
        .positive('Genre Id must be positive')
        .nullable()
        .optional(),
    examPiece: z.boolean()
        .nullable()
        .optional()
});


// SHEET IMPORT COMPONENT
export default function SheetImport({
    sourcesLookup,
    isLoadingSource,
    levelsLookup,
    isLoadingLevel,
    genresLookup,
    isLoadingGenre,
}: SheetImportProps) {

    const parseFile = (file: File) => {

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),
            error: function (err: Error) {
                // process if an error occurs
                console.log(err);

                // if the parse failed
                // Get the error
                // Return the error
            },
            complete: function(results: ParseResult<unknown>) {
                // process after the parsing is complete

                console.log('parsed data');
                console.log(results.data);

                // Validate
                const csvValidatedData = results.data.map(row => csvSheetSchema.safeParse(row));
                const csvValidData = csvValidatedData.filter(row => row.success);

                console.log('validated data');
                console.log(csvValidatedData);
                console.log(csvValidData);


                // Transform 

                function transformCSVBoolean(value: string | null | undefined): boolean {

                    if (value?.trim().toLowerCase() === "true") return true;
                    return false;
                }

                const transformedData = csvValidData.map(row => ({
                    title: row.data!.title,
                    key: row.data?.key ?? null,
                    composer: row.data?.composer ?? null,
                    sourceId: sourcesLookup.find(source => source.title.trim().toLowerCase() === row.data?.source?.trim().toLowerCase())?.id ?? null,
                    levelId: levelsLookup.find(level => level.name.trim().toLowerCase() === row.data?.level?.trim().toLowerCase())?.id ?? null,
                    genreId: genresLookup.find(genre => genre.name.trim().toLowerCase() === row.data?.genre?.trim().toLowerCase())?.id ?? null,
                    examPiece: transformCSVBoolean(row.data?.examPiece),
                }));

                console.log('transformed data');
                console.log(transformedData);

                // Validate
                const validatedTransformedData = transformedData.map(row => dbSheetSchema.safeParse(row));

                console.log('validated transformed data');
                console.log(validatedTransformedData);
                // Call the API
                

               // importSheets(results, ) // token
            }
        });

    }

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {

        if (acceptedFiles[0]) console.log(`${acceptedFiles[0].name} accepted`);

        // Parse the file
        parseFile(acceptedFiles[0]);

    }, []) 

    const {
        getRootProps, 
        getInputProps, 
        isDragActive,
        acceptedFiles,
        fileRejections
    } = useDropzone({
        accept: {
            'text/csv': ['.csv']
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
        onDrop
    });

    return (
        <div {...getRootProps()} className="flex flex-col text-center">
            <input {...getInputProps()} />

            {
                isDragActive ?
                    <p className="mt-3 mb-3">Drop the file here ...</p> :
                    <p className="mt-3 mb-3">Drag and drop a .csv file here, or click to select a .csv file.</p>
            }
            { acceptedFiles.length > 0 && (<p className="mt-3 mb-3 text-green-500">{acceptedFiles[0].name}</p>) }
            { fileRejections.length > 0 && (<p className="mt-3 mb-3 text-red-600">Invalid file or type size</p>) }
        </div>
    )
}