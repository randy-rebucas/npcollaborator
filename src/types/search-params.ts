export type SearchParamValue = string | string[] | undefined;

export type SearchParams = Promise<{
    [key: string]: SearchParamValue;
}>