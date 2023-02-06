import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Mgo+DSMBaFt/QHRqVVhkVFpFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jS35Vd0RgWn5adXVWRA==;Mgo+DSMBPh8sVXJ0S0J+XE9AflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TdEVlWH5dc3VRQ2JaUg==;ORg4AjUWIQA/Gnt2VVhkQlFacldJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkdjX35fc3dUQmhUU0Y=;MTA3NDI3MkAzMjMwMmUzNDJlMzBqR1JCcmxxeFBDbUEwM3hZYUh6QzVTbFNXaUZYWFVMcERQMGNCK2pDZnp3PQ==;MTA3NDI3M0AzMjMwMmUzNDJlMzBIVk1rNUkwc1VXZVZ5YmhPV0IwMWNtTEFtbmtvMkZoUUQzckNqQTJIM3c4PQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFtKVmJLYVB3WmpQdldgdVRMZVVbQX9PIiBoS35RdUVhWXlfcXdWR2RVV0Z1;MTA3NDI3NUAzMjMwMmUzNDJlMzBielNCRzVTeHRSd2lBSFQ1cW92RzRXa0U2QjFJek5Ma1NCYVFQZUxUNXBJPQ==;MTA3NDI3NkAzMjMwMmUzNDJlMzBZbGpreGRFOHdoWGgwMnNEUkxIcUx1NXhOc0JRRjlLZmhXYVppQ1I1WlNnPQ==;Mgo+DSMBMAY9C3t2VVhkQlFacldJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkdjX35fc3dUQ2BeWEA=;MTA3NDI3OEAzMjMwMmUzNDJlMzBhVW96amRkMHZTMkJRbmw2QVpueC9lYktBOEhCY3lkRXRBUXNiN1hjMkxRPQ==;MTA3NDI3OUAzMjMwMmUzNDJlMzBLYW5kdmxUeC9OeTJjUmVKMC9veW5pQzVlSmNxQ2hYdU9aalZmd2Nqd3hrPQ==;MTA3NDI4MEAzMjMwMmUzNDJlMzBielNCRzVTeHRSd2lBSFQ1cW92RzRXa0U2QjFJek5Ma1NCYVFQZUxUNXBJPQ==');


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
