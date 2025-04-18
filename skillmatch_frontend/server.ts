import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';

import { AppComponent } from './src/app/app.component';
import { provideServerRendering } from '@angular/platform-server';
import { provideClientHydration } from '@angular/platform-browser';
import { bootstrapApplication } from '@angular/platform-browser';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/skillmatch_frontend/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine
  server.engine('html', ngExpressEngine({
    bootstrap: () => bootstrapApplication(AppComponent, {
      providers: [
        provideServerRendering(),
        provideClientHydration()
      ]
    })
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req: Request, res: Response) => {
    res.render(indexHtml, { 
      req, 
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl }
      ] 
    }, (err: Error, html: string) => {
      if (err) {
        console.error('Error rendering page:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(html);
    });
  });

  return server;
}

// For Vercel serverless environment
const handler = app();

export default handler; 