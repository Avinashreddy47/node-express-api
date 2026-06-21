/**
 * Query Builder Utility
 * Handles advanced filtering, sorting, and pagination
 * Supports complex operators: gt (>), gte (>=), lt (<), lte (<=), contains, startsWith, endsWith, between, in
 */

export class QueryBuilder {
  constructor(data = []) {
    this.data = data;
    this.filters = {};
    this.sortBy = {};
    this.page = 1;
    this.limit = 10;
  }

  /**
   * Parse query parameters into filters, sort, pagination
   * Example query string: ?search=john&email_contains=@gmail.com&age_gte=18&sort=-createdAt&page=2&limit=20
   */
  static fromQuery(queryParams) {
    const builder = new QueryBuilder();

    // Parse pagination
    if (queryParams.page) {
      builder.page = Math.max(1, parseInt(queryParams.page));
    }
    if (queryParams.limit) {
      builder.limit = Math.min(100, Math.max(1, parseInt(queryParams.limit)));
    }

    // Parse sorting
    if (queryParams.sort) {
      const sortParams = Array.isArray(queryParams.sort) ? queryParams.sort : [queryParams.sort];
      sortParams.forEach((sortParam) => {
        const isDesc = sortParam.startsWith('-');
        const field = isDesc ? sortParam.slice(1) : sortParam;
        builder.sortBy[field] = isDesc ? -1 : 1;
      });
    }

    // Parse filters (exclude pagination and sort params)
    const excludeKeys = ['page', 'limit', 'sort', 'search'];
    Object.entries(queryParams).forEach(([key, value]) => {
      if (excludeKeys.includes(key)) return;

      // Check for operators: field_operator=value
      const parts = key.split('_');
      const operator = parts.pop();
      const field = parts.join('_');

      if (['gt', 'gte', 'lt', 'lte', 'contains', 'startsWith', 'endsWith', 'between', 'in', 'eq', 'ne'].includes(operator)) {
        if (!builder.filters[field]) {
          builder.filters[field] = {};
        }
        builder.filters[field][operator] = value;
      } else {
        // Default to equality
        if (!builder.filters[key]) {
          builder.filters[key] = {};
        }
        builder.filters[key].eq = value;
      }
    });

    // Handle global search (searches across multiple text fields)
    if (queryParams.search) {
      builder.searchTerm = queryParams.search.toLowerCase();
      builder.searchFields = queryParams.searchFields ? queryParams.searchFields.split(',') : ['email', 'username'];
    }

    return builder;
  }

  /**
   * Apply filters to data
   */
  filter(data) {
    return data.filter((item) => {
      // Global search filter
      if (this.searchTerm) {
        const matches = this.searchFields.some((field) => {
          const value = this._getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(this.searchTerm);
        });
        if (!matches) return false;
      }

      // Field-specific filters
      for (const [field, operators] of Object.entries(this.filters)) {
        const value = this._getNestedValue(item, field);

        for (const [operator, filterValue] of Object.entries(operators)) {
          if (!this._applyOperator(value, operator, filterValue)) {
            return false;
          }
        }
      }

      return true;
    });
  }

  /**
   * Apply sorting to data
   */
  sort(data) {
    if (Object.keys(this.sortBy).length === 0) {
      return data;
    }

    return [...data].sort((a, b) => {
      for (const [field, direction] of Object.entries(this.sortBy)) {
        const aVal = this._getNestedValue(a, field);
        const bVal = this._getNestedValue(b, field);

        if (aVal === bVal) continue;

        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return comparison * direction;
      }
      return 0;
    });
  }

  /**
   * Apply pagination to data
   */
  paginate(data) {
    const total = data.length;
    const startIndex = (this.page - 1) * this.limit;
    const endIndex = startIndex + this.limit;

    return {
      data: data.slice(startIndex, endIndex),
      total,
      page: this.page,
      limit: this.limit,
      pages: Math.ceil(total / this.limit),
    };
  }

  /**
   * Execute full query pipeline: filter -> sort -> paginate
   */
  execute(data = this.data) {
    let result = this.filter(data);
    result = this.sort(result);
    return this.paginate(result);
  }

  /**
   * Get nested value from object (supports dot notation: user.profile.name)
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Apply single operator to value
   */
  _applyOperator(value, operator, filterValue) {
    const val = value?.toString().toLowerCase() || '';
    const filter = filterValue?.toString().toLowerCase() || '';

    switch (operator) {
      case 'eq':
        return val === filter;

      case 'ne':
        return val !== filter;

      case 'gt':
        return Number(value) > Number(filterValue);

      case 'gte':
        return Number(value) >= Number(filterValue);

      case 'lt':
        return Number(value) < Number(filterValue);

      case 'lte':
        return Number(value) <= Number(filterValue);

      case 'contains':
        return val.includes(filter);

      case 'startsWith':
        return val.startsWith(filter);

      case 'endsWith':
        return val.endsWith(filter);

      case 'in': {
        const values = filterValue.split(',').map((v) => v.trim().toLowerCase());
        return values.includes(val);
      }

      case 'between': {
        const [min, max] = filterValue.split(',').map(Number);
        const num = Number(value);
        return num >= min && num <= max;
      }

      default:
        return true;
    }
  }
}
