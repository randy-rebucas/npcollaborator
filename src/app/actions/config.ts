import Config, { IConfig } from "../../models/Config"
import connect from "@/lib/db"
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, ValidationError } from '@/lib/errors';

/**
 * Retrieves the entire configuration object from the database
 * @returns The configuration object or null if not found
 */
export async function getConfig() {
    const [result, error] = await handleAsync(
        (async () => {
            await connect()
            const config = await Config.findOne({})
            return config || null
        })()
    )

    if (error) {
        throw new DatabaseError('Failed to fetch configuration')
    }

    return result
}

/**
 * Retrieves a specific configuration value by key
 * @param key The configuration key to retrieve
 * @returns The configuration value or null if not found
 */
export async function getConfigValue<T>(key: string): Promise<T | null> {
    if (!key) {
        throw new ValidationError('Configuration key is required')
    }

    const [result, error] = await handleAsync(
        (async () => {
            await connect()
            const config = await Config.findOne({})
            return config ? (config[key] as T) : null
        })()
    )

    if (error) {
        throw new DatabaseError(`Failed to fetch configuration value for ${key}`)
    }

    return result
}

export async function updateConfig(data: Partial<IConfig>) {
    const [result, error] = await handleAsync(
        (async () => {
            await connect()
            const config = await Config.findOneAndUpdate({}, data, { new: true, upsert: true })

            return config
        })()
    )

    if (error) {
        throw new DatabaseError('Failed to update configuration')
    }

    return result
}


export async function createConfig(data: Partial<IConfig>) {
    const [result, error] = await handleAsync(
        (async () => {
            await connect()
            const config = await Config.create(data)

            return config
        })()
    )

    if (error) {
        throw new DatabaseError('Failed to create configuration')
    }

    return result
}



export async function deleteConfig(id: string) {
    const [result, error] = await handleAsync(
        (async () => {
            await connect()
            const config = await Config.findByIdAndDelete(id)

            return config
        })()
    ) 

    if (error) {
        throw new DatabaseError('Failed to delete configuration')
    }

    return result
}



