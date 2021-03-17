import moment from 'moment';
import * as R from 'ramda';

const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

const dateWrapper = (data: any[]) => {
  return data.map(item => {
    for (const key in item) {
      const val = item[key];
      if (typeof val === 'string' && ISO_8601_FULL.test(val)) {
        item[key] = moment(val).toDate();
      }
    }
    return item;
  });
};

const typeWrapper = (data: any[]) => R.pipe(dateWrapper)(data);

export { typeWrapper };
