import joi from 'joi'

export const email = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required()
export const password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required()
export const username = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
export const id = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
export const Title = joi.string().required()
export const Description = joi.string().required()
export const Artist = joi.string().required()
export const name = joi.string().required()

export const playlistId = joi.string()
    .pattern(/^(?!https?:\/\/)/) // Kiểm tra không bắt đầu bằng 'http://' hoặc 'https://'
    .required();
export const visualId = joi.string()
    .pattern(/^(?!https?:\/\/)/)
    .required();

export const sounds = joi.array().items(
    joi.object({
        soundId: joi.string().required(),
        volume: joi.number().min(0).max(1).required()
    })
).required()
export const musicUrl = joi.string().required()
export const imageUrl = joi.string().required()
export const visualUrl = joi.string().required()
export const soundUrl = joi.string().required()
export const soundVol = joi.string().required()
export const ArtistId = joi.string().required()
export const vip = joi.boolean().required();
export const userId = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required();
