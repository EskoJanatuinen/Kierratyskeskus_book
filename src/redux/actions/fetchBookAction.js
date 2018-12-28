/* eslint-disable import/prefer-default-export */

import { fetchBookBegin, fetchBookFailure, fetchBookSuccess } from '../types';

const fetchBook = (isbn) => {
  const book = {
    isbn: 'xxxxxxxxxxxxx',
    title: null,
    description: '',
    authors: [],
    publisher: null,
    pageCount: null,
    publishedDate: null,
    imageUrl: null,
  };

  const validateData = (parameters) => {
    const { bookData, book } = parameters;
    book.isbn = bookData.industryIdentifiers[1]
      ? bookData.industryIdentifiers[1].identifier
      : 'xxxxxxxxxxxxx';
    book.title = bookData.title ? bookData.title : '';
    book.authors = bookData.authors ? bookData.authors : '';
    book.description = bookData.description ? bookData.description : '';
    book.imageUrl = bookData.imageLinks ? bookData.imageLinks.thumbnail : '';
    book.pageCount = bookData.pageCount ? bookData.pageCount : '';
    book.publisher = bookData.publisher ? bookData.publisher : '';
    book.publishedDate = bookData.publishedDate ? bookData.publishedDate : '';

    return book;
  };

  const action = (dispatch) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    dispatch(fetchBookBegin());

    const request = fetch(url, {
      method: 'GET',
    });
    return request
      .then(bookData => bookData.json())
      .then(
        (bookJSON) => {
          if (!bookJSON.totalItems <= 0) {
            console.log('found');
            const bookData = bookJSON.items[0].volumeInfo;
            validateData({ bookData, book });
            dispatch(fetchBookSuccess(book));
          } else {
            dispatch(fetchBookFailure('Not a valid barcode'));
          }
        },
        error => dispatch(fetchBookFailure(error)),
      );
  };
  return action;
};


export { fetchBook };
