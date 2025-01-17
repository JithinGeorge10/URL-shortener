import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from './url.schema';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UrlsService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async shortenUrl(originalUrl: string): Promise<Url> {
    try {
      // Call the TinyURL API to shorten the URL
      const response = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(originalUrl)}`);

      const shortUrl = response.data;

      // Save the original and short URL in the database
      const newUrl = new this.urlModel({ originalUrl, shortUrl });
      return newUrl.save();
    } catch (error) {
      throw new HttpException(
        'Failed to shorten URL with TinyURL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOriginalUrl(shortUrl: string): Promise<string> {
    const url = await this.urlModel.findOne({ shortUrl });
    if (!url) {
      throw new HttpException('Short URL not found', HttpStatus.NOT_FOUND);
    }
    return url.originalUrl;
  }
}
