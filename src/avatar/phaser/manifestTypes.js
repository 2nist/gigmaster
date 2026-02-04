/**
 * Avatar manifest shared type definitions.
 * These are JSDoc typedefs consumed by JS and TS tooling.
 */

/**
 * @typedef {Object} AvatarFeatureVariants
 * @property {string} name - Variant identifier exposed to UI selectors.
 * @property {string[]} [paletteTags] - Palette tags to apply when variant selected.
 * @property {string|null} [textureOverride] - Optional alternate texture relative to the feature folder.
 */

/**
 * @typedef {Object} AvatarFeature
 * @property {string} id
 * @property {string} path
 * @property {string} filename
 * @property {number} weight
 * @property {{ width: number, height: number } | null} resolution
 * @property {string|null} tone
 * @property {string[]} genderTags
 * @property {string[]} styleTags
 * @property {string[]} ageRange
 * @property {string[]} variants
 * @property {string[]} hueVariants
 * @property {boolean} supportsTint
 * @property {string|null} normalMap
 * @property {string|null} roughnessMap
 * @property {string|null} atlas
 * @property {string|null} frame
 * @property {number|null} zIndex
 * @property {number|null} intensity
 * @property {string|null} metadataAuthor
 * @property {string|null} metadataNotes
 */

/**
 * @typedef {Object} AvatarLayer
 * @property {string} name
 * @property {number|null} order
 * @property {string} description
 * @property {string|null} defaultPalette
 * @property {number|null} zIndex
 * @property {string} blendMode
 * @property {AvatarFeature[]} features
 */

/**
 * @typedef {Object} AvatarManifest
 * @property {string} generatedAt
 * @property {number} version
 * @property {AvatarLayer[]} layers
 */

export const AVATAR_MANIFEST_VERSION = 2;
