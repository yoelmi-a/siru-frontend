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

  previousPage = computed(() => Math.max(1, this.currentPage() - 1));
  nextPage = computed(() => this.currentPage() + 1);

  getActualItemsRange = computed(() => {
    const start = this.currentPage() === 1 ? 1 : (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.totalCount(), this.currentPage() * this.pageSize());

    return start === end ? `${start}` : `${start} - ${end}`;
  });

}
