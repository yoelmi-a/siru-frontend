import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'pagination',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pagination.html',
})
export class Pagination {
  currentPage = input<number>(1);
  hasPreviousPage = input<boolean>(false);
  hasNextPage = input<boolean>(false);
  totalCount = input<number>(10);
  pageSize = input<number>(10);

  pageChange = output<number>();

  getActualItemsRange = computed(() => {
    const start = this.currentPage() === 1 ? 1 : (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.totalCount(), this.currentPage() * this.pageSize());

    return start === end ? `${start}` : `${start} - ${end}`;
  });

  onPageChange(page: number) {
    if (page >= 1) {
      this.pageChange.emit(page);
    }
  }
}
