import { Controller, Post, Body, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Response } from 'express';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  async shorten(@Body('originalUrl') originalUrl: string) {
    console.log(originalUrl,'cdscds');
    
    const result = await this.urlsService.shortenUrl(originalUrl);
    console.log(result.shortUrl,'cdscdsc')
    return { shortUrl: result.shortUrl };
  }

  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const originalUrl = await this.urlsService.getOriginalUrl(shortUrl);
    res.redirect(HttpStatus.FOUND, originalUrl);
  }
}
