export const signture = {
    name: 'mypet-signature',
    required: true,
    description: 'API KEY for authentication',
    schema: {
        type: 'string',
        example: process.env.API_KEY || "AUTHENTICATION"
    }
}


export const authentication = {
    name: 'Authentication',
    required: true,
    description: 'Token for authentication', // @todo
    schema: {
        type: 'string',
        example: "Bearer "
    }
}



