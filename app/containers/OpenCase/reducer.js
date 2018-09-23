/*
 *
 * LanguageProvider reducer
 *
 */

import { OPEN_CASE, UPDATE_CASE } from './constants'

export const initialState = {
    cases: {
        1: {
            id: 1,
            loading: false,
            step: 0,
            steps: 2,
            type: 'attached',
            parties: ['microsoft', 'alphabet'],
            party1: 'Microsoft',
            party2: 'Alphabet',
            files: ['thesis.pdf'],
            signature:
        'eaf583996255d2bc6063e068c07374dc051cd0fd7c7157496282a1ca2675609c',
            signature2:
        'cadf83996255da267aa9809c2b234fabcdd8c07374dc051cd031234994282d44',
            expertise: 2,
            judges: ['3', '4'],
            state: 'pending',
        },
        2: {
            id: 2,
            step: 0,
            steps: 2,
            state: 'signed',
            type: 'attached',
            loading: false,
            parties: ['microsoft', 'lenovo'],
            party1: 'Microsoft',
            party2: 'Lenovo',
            files: ['contract.pdf'],
            signature:
        'cadf83996255da267aa9809c2b234fabcdd8c07374dc051cd031234994282d44',
            signature2:
        'eaf583996255d2bc6063e068c07374dc051cd0fd7c7157496282a1ca2675609c',
            expertise: 2,
            judges: ['3'],
        },
        3: {
            id: 3,
            step: 0,
            steps: 2,
            state: 'disputed',
            loading: false,
            disputeEnd: '2018-10-10',
            type: 'attached',
            parties: ['hp', 'microsoft'],
            party1: 'HP',
            party2: 'Microsoft',
            files: ['contract.pdf'],
            signature:
        'bc6063e068c07374dc051cd0fd734fabcdd8c07374dc051cd031234994282d44',
            signature2:
        'd734fabcdd990191375ab729c919ef12664581cd0fd7abd8811cd031254d3f24',
            expertise: 1,
            judges: ['2'],
        },
    },
}

function casesReducer(state = initialState, action) {
    switch (action.type) {
    case OPEN_CASE:
        return {
            ...state,
            cases: { ...state.cases, [action.payload.id]: action.payload },
        }
    case UPDATE_CASE:
        return {
            ...state,
            cases: { ...state.cases, [action.payload.id]: action.payload },
        }
    default:
        return state
    }
}

export default casesReducer
