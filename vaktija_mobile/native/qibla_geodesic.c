#include "geodesic.h"

#if defined(_WIN32)
__declspec(dllexport)
#else
__attribute__((visibility("default")))
#endif
void vaktija_wgs84_inverse(double lat1, double lon1, double lat2, double lon2,
                           double *distance_and_azimuth) {
  struct geod_geodesic model;
  geod_init(&model, 6378137.0, 1.0 / 298.257223563);
  geod_inverse(&model, lat1, lon1, lat2, lon2, distance_and_azimuth,
               distance_and_azimuth + 1, 0);
}
