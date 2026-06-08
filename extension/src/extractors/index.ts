import {
  extractImmoScout24CurrentPage,
  extractImmoScout24DetailListing,
  extractImmoScout24Listings
} from "./immoscout24";

export const portalExtractors = {
  immobilienscout24: {
    matches(hostname: string) {
      return hostname.endsWith("immobilienscout24.de");
    },
    extractCurrentPage: extractImmoScout24CurrentPage,
    extractListPage: extractImmoScout24Listings,
    extractDetailPage: extractImmoScout24DetailListing
  }
};

export function getExtractorForLocation(location: Location) {
  return Object.values(portalExtractors).find((extractor) =>
    extractor.matches(location.hostname)
  );
}
