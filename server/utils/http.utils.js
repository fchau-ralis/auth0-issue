'use strict';
/**
 * @description This module provides abstracted http related functionality
 */
const request = require('request-promise');
const constants = require('./constants.utils');

/**
 * Handle errors, including optional transaction management for handling rollbacks in db errors
 * @param res {object} - thee http response modelect
 * @param status {int} - the http error status
 * @param message {string} - the error message
 * @param transaction {object} - optional, the db transaction instance
 */
let handleError = (res, status, message, transaction) => {
    // if the transaciton was passed in, then we want to rollback
    if (transaction) {
        return dbUtils
            .rollback(transaction)
            .then(() => res.status(status).send(message))
            .catch(err =>
                res
                    .status(err.status)
                    .send(constants.MESSAGES[err.status] || err.message)
            );
    } else {
        // return the provided status and message
        return res.status(status).send(message);
    }
};

/**
 * Handles sending success responses to the user
 * @param res {object} - the http response modelect
 * @param status {int} - the http status to be sent
 * @param data {any} - the data to be sent in the response body
 * @param transaction {object} - optional transaction for committing to the database
 */
let handleSuccess = (res, status, data, transaction) => {
    if (transaction) {
        return dbUtils
            .commit(transaction)
            .then(() => res.status(status).send({ data: data }))
            .catch(err =>
                handleError(
                    res,
                    err.status,
                    constants.MESSAGES[err.status] || err.message,
                    transaction
                )
            );
    } else {
        return res.status(status).send({ data: data });
    }
};

/**
 * @description fires off an http request within the given params
 * @param {String} method GET POST PUT PATCH
 * @param {Object} body Message body
 * @param {Object} headers Message Headers
 * @param {String} url url to ping
 * @param {Object} queryParams query paramets to be applied
 */
let sendRequest = (method, body, headers, url, queryParams, isJson = true) => {
    return new Promise((resolve, reject) => {
        request(
            buildRequestObject(method, body, headers, url, queryParams, isJson),
            (err, response) => {
                if (err) return reject(err);
                resolve(response);
            }
        );
    }).then(response => {
        return validateResponse(response);
    });
};

/**
 * @description helper for building the request object used in api calls
 * @param {String} method GET POST PUT PATCH
 * @param {Object} body Message body
 * @param {Object} headers Message Headers
 * @param {String} url url to ping
 * @param {Object} queryParams query paramets to be applied
 */
let buildRequestObject = (
    method,
    body,
    headers,
    url,
    queryParams,
    isJson = true
) => {
    let reqObject = {
        method: method,
        uri: url,
        json: isJson,
    };
    if (headers) reqObject.headers = headers;
    if (body) reqObject.body = body;
    if (queryParams) reqObject.qs = queryParams;
    return reqObject;
};

/**
 * Validates that a valid response was returned
 * @param {Promise} response express response object
 */
let validateResponse = response => {
    return new Promise((resolve, reject) => {
        if (response.statusCode >= 400) {
            return reject(response);
        }
        resolve(response);
    });
};

module.exports = {
    handleError,
    handleSuccess,
    sendRequest,
};
