import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
})
export class Pagination {
  currentPage = input<number>(1);
  hasPreviousPage = input<boolean>(false);
  hasNextPage = input<boolean>(false);
  totalCount = input<number>(10);
  pageSize = input<number>(10);
  activePage = linkedSignal(this.currentPage);

  getActualItemsRange = computed(() => {
    const currentPageByPageSize = this.activePage() * this.pageSize();
    var start = this.activePage() === 1 ? 1 : (this.activePage() - 1) * this.pageSize() + 1;
    var end = Math.min(this.totalCount(), this.activePage() * this.pageSize());

    return start === end ? `${start}` : `${start} - ${end}`;
  });

}
