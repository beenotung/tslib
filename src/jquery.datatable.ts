declare let $: any;

// TODO better type def
/* tslint:disable:ban-types */
export interface JQuery {
  DataTable: Function;
  dataTable: Function;
}

/* tslint:enable:ban-types */

export interface DataTableOption {
  lengthOptions: number[];
  searchPlaceholder: string;
  allText: string;
}

const defaultOption: DataTableOption = {
  lengthOptions: [10, 25, 50, -1],
  searchPlaceholder: 'Search records',
  allText: 'All',
};

export function initDatatable(e: HTMLTableElement, option?: DataTableOption) {
  option = Object.assign({}, defaultOption, option);
  $(e).DataTable({
    pagingType: 'full_numbers',
    lengthMenu: [
      option.lengthOptions,
      option.lengthOptions.map(x => {
        if (x !== -1) {
          return x;
        } else {
          return (option as DataTableOption).allText;
        }
      }),
    ],
    responsive: true,
    language: {
      search: '_INPUT_',
      searchPlaceholder: option.searchPlaceholder,
    },
  });
}
