const [result] = await this.contentModel.aggregate([
  // 筛选
  { $match: filter },
  // 排序
  { $sort: { time: -1 } },
  {
    // 向文档添加新字段
    $addFields: {
      report: {
        $cond: {
          if: {
            $or: [{ $not: ['$report'] }],
          },
          then: {
            $concat: [
              { $substrCP: ['$content', 0, 80] },
              {
                $cond: {
                  if: { $gt: [{ $strLenCP: '$content' }, 50] },
                  then: '...',
                  else: '',
                },
              },
            ],
          },
          else: '$report',
        },
      },
    },
  },
  {
    // 在同一个聚合阶段内并行执行多个独立的子管道，并将所有结果合并输出到指定字段中
    $facet: {
      list: [
        ...paginationStages,
        {
          $project: {
            _id: 1,
            url: 1,
            title: 1,
            report: 1,
            time: 1,
          },
        },
      ],
      total: [{ $count: 'count' }],
    },
  },
]);
